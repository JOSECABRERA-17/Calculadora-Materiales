from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from DATA import conectar_base_datos, crear_tablas
import json
import sqlite3

app = Flask(__name__)
CORS(app)


# Verificar que el backend funciona
@app.route("/api/estado", methods=["GET"])
def consultar_estado():
    return jsonify({
        "mensaje": "Backend funcionando correctamente",
        "estado": "correcto"
    })


# Verificar la conexión con la base de datos
@app.route("/api/estado-base-datos", methods=["GET"])
def consultar_estado_base_datos():
    conexion = None

    try:
        crear_tablas()
        conexion = conectar_base_datos()
        conexion.execute("SELECT 1")

        return jsonify({
            "mensaje": "Conexión con la base de datos exitosa",
            "estado": "correcto"
        })

    except Exception:
        return jsonify({
            "mensaje": "Error al conectar con la base de datos",
            "estado": "error"
        }), 500

    finally:
        if conexion is not None:
            conexion.close()


# CREATE: guardar un cálculo
@app.route("/api/calculos", methods=["POST"])
def crear_calculo():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            "error": "Debes enviar los datos en formato JSON"
        }), 400

    usuario_id = datos.get("usuario_id")
    tipo_calculo = datos.get("tipo_calculo")
    datos_entrada = datos.get("datos_entrada")
    resultados = datos.get("resultados")

    if (
        not isinstance(usuario_id, int)
        or isinstance(usuario_id, bool)
        or usuario_id <= 0
        or not isinstance(tipo_calculo, str)
        or not tipo_calculo.strip()
        or not isinstance(datos_entrada, dict)
        or not isinstance(resultados, dict)
    ):
        return jsonify({
            "error": "Faltan datos o tienen un formato incorrecto"
        }), 400

    conexion = None

    try:
        conexion = conectar_base_datos()

        cursor = conexion.execute("""
            INSERT INTO calculos (
                usuario_id, tipo_calculo, datos_entrada, resultados
            )
            VALUES (?, ?, ?, ?)
        """, (
            usuario_id,
            tipo_calculo.strip(),
            json.dumps(datos_entrada),
            json.dumps(resultados)
        ))

        conexion.commit()

        return jsonify({
            "mensaje": "Cálculo guardado correctamente",
            "id": cursor.lastrowid
        }), 201

    except Exception:
        if conexion is not None:
            conexion.rollback()

        return jsonify({
            "error": "No se pudo guardar el cálculo. Verifica que el usuario exista."
        }), 400

    finally:
        if conexion is not None:
            conexion.close()


# READ: consultar todos los cálculos
@app.route("/api/calculos", methods=["GET"])
def consultar_calculos():
    conexion = conectar_base_datos()

    try:
        registros = conexion.execute("""
            SELECT id, usuario_id, tipo_calculo,datos_entrada, resultados, fecha
            FROM calculos
            ORDER BY id DESC
        """).fetchall()

        calculos = []

        for registro in registros:
            calculos.append({
                "id": registro["id"],
                "usuario_id": registro["usuario_id"],
                "tipo_calculo": registro["tipo_calculo"],
                "datos_entrada": json.loads(registro["datos_entrada"]),
                "resultados": json.loads(registro["resultados"]),
                "fecha": registro["fecha"]
            })

        return jsonify(calculos)

    finally:
        conexion.close()


# UPDATE: modificar un cálculo existente
@app.route("/api/calculos/<int:id_calculo>", methods=["PUT"])
def actualizar_calculo(id_calculo):
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            "error": "Debes enviar los datos en formato JSON"
        }), 400

    tipo_calculo = datos.get("tipo_calculo")
    datos_entrada = datos.get("datos_entrada")
    resultados = datos.get("resultados")

    if (
        not isinstance(tipo_calculo, str)
        or not tipo_calculo.strip()
        or not isinstance(datos_entrada, dict)
        or not isinstance(resultados, dict)
    ):
        return jsonify({
            "error": "Los datos enviados tienen un formato incorrecto"
        }), 400

    conexion = conectar_base_datos()

    try:
        cursor = conexion.execute("""
            UPDATE calculos
            SET tipo_calculo = ?, datos_entrada = ?, resultados = ?
            WHERE id = ?
        """, (
            tipo_calculo.strip(),
            json.dumps(datos_entrada),
            json.dumps(resultados),
            id_calculo
        ))

        conexion.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "error": "No se encontró el cálculo"
            }), 404

        return jsonify({
            "mensaje": "Cálculo actualizado correctamente"
        })

    finally:
        conexion.close()


# DELETE: eliminar un cálculo
@app.route("/api/calculos/<int:id_calculo>", methods=["DELETE"])
def eliminar_calculo(id_calculo):
    conexion = conectar_base_datos()

    try:
        cursor = conexion.execute(
            "DELETE FROM calculos WHERE id = ?",
            (id_calculo,)
        )

        conexion.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "error": "No se encontró el cálculo"
            }), 404

        return jsonify({
            "mensaje": "Cálculo eliminado correctamente"
        })

    finally:
        conexion.close()


@app.route("/api/registro", methods=["POST"])
def registrar_usuario():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            "error": "Los datos deben enviarse en formato JSON"
        }), 400

    nombre = datos.get("nombre")
    correo = datos.get("correo")
    contraseña = datos.get("contraseña")
    confirmar = datos.get("confirmar")
    print("Datos recibidos:", datos)

    if not all(
        isinstance(valor, str) and valor.strip()
        for valor in (nombre, correo, contraseña, confirmar)
    ):
        return jsonify({
            "error": "Todos los campos son obligatorios"
        }), 400

    nombre = nombre.strip()
    correo = correo.strip().lower()

    if len(nombre) > 50 or len(correo) > 254:
        return jsonify({
            "error": "El nombre o correo supera la longitud permitida"
        }), 400

    if len(contraseña) < 8 or len(contraseña) > 25:
        return jsonify({
            "error": "La contraseña debe tener entre 8 y 25 caracteres"
        }), 400

    if contraseña != confirmar:
        return jsonify({
            "error": "Las contraseñas no coinciden"
        }), 400

    conexion = conectar_base_datos()

    try:
        contraseña_protegida = generate_password_hash(contraseña)

        cursor = conexion.execute("""
            INSERT INTO usuarios (
                nombre_usuario, correo, contrasena
            )
            VALUES (?, ?, ?)
        """, (nombre, correo, contraseña_protegida))

        conexion.commit()

        return jsonify({
            "mensaje": "Usuario registrado correctamente",
            "id": cursor.lastrowid
        }), 201

    except sqlite3.IntegrityError:
        conexion.rollback()

        return jsonify({
            "error": "El nombre de usuario o correo ya está registrado"
        }), 409

    finally:
        conexion.close()
from flask import send_from_directory

@app.route("/api/login", methods=["POST"])
def iniciar_sesion():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            "error": "Debes enviar los datos en formato JSON"
        }), 400

    correo = datos.get("correo")
    contraseña = datos.get("contraseña")

    if not isinstance(correo, str) or not correo.strip():
        return jsonify({
            "error": "Ingresa tu correo de usuario"
        }), 400

    if not isinstance(contraseña, str) or not contraseña:
        return jsonify({
            "error": "Ingresa tu contraseña"
        }), 400

    conexion = conectar_base_datos()

    try:
        usuario = conexion.execute("""
            SELECT id, nombre_usuario, correo, contrasena, rol
            FROM usuarios
            WHERE correo = ?
        """, (correo.strip(),)).fetchone()
        
        if usuario is None or not check_password_hash(
            usuario["contrasena"], contraseña
        ):
            return jsonify({
                "error": "Usuario o contraseña incorrectos"
            }), 401

        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "usuario": {
                "id": usuario["id"],
                "nombre": usuario["nombre_usuario"],
                "rol": usuario["rol"]
            }
        }), 200

    finally:
        conexion.close()

@app.route("/api/recuperar-contrasena", methods=["POST"])
def recuperar_contrasena():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            "error": "Debes enviar los datos en formato JSON"
        }), 400

    nombre = datos.get("nombre")
    correo = datos.get("correo")
    nueva_contrasena = datos.get("nueva_contrasena")

    if not all(
        isinstance(valor, str) and valor.strip()
        for valor in (nombre, correo, nueva_contrasena)
    ):
        return jsonify({
            "error": "Todos los campos son obligatorios"
        }), 400

    nombre = nombre.strip()
    correo = correo.strip().lower()

    if len(nueva_contrasena) < 8 or len(nueva_contrasena) > 25:
        return jsonify({
            "error": "La contraseña debe tener entre 8 y 25 caracteres"
        }), 400

    conexion = conectar_base_datos()

    try:
        usuario = conexion.execute("""
            SELECT id
            FROM usuarios
            WHERE nombre_usuario = ? AND correo = ?
        """, (nombre, correo)).fetchone()

        if usuario is None:
            return jsonify({
                "error": "El nombre de usuario o correo no coinciden"
            }), 404

        contraseña_protegida = generate_password_hash(nueva_contrasena)

        conexion.execute("""
            UPDATE usuarios
            SET contrasena = ?
            WHERE id = ?
        """, (contraseña_protegida, usuario["id"]))

        conexion.commit()

        return jsonify({
            "mensaje": "Contraseña actualizada correctamente"
        }), 200

    except Exception:
        conexion.rollback()
        return jsonify({
            "error": "No se pudo actualizar la contraseña"
        }), 500

    finally:
        conexion.close()


@app.route("/")
def inicio():
    return send_from_directory(".", "1. INICIO_SESION.html")


@app.route("/registro")
def pagina_registro():
    return send_from_directory(".", "2. REGISTRO.html")


@app.route("/<path:archivo>")
def archivos_proyecto(archivo):
    return send_from_directory(".", archivo)

if __name__ == "__main__":
    crear_tablas()
    app.run(debug=True)