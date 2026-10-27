
import sqlite3


def conectar_base_datos():
    conexion = sqlite3.connect("calculadora.db")
    conexion.row_factory = sqlite3.Row
    conexion.execute("PRAGMA foreign_keys = ON")
    return conexion


def crear_tablas():
    conexion = conectar_base_datos()

    try:
        cursor = conexion.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_usuario TEXT NOT NULL UNIQUE,
                correo TEXT UNIQUE,
                contrasena TEXT NOT NULL,
                rol TEXT NOT NULL DEFAULT 'usuario'
            )
        """)

        # Añadir correo si la tabla ya existía
        columnas = cursor.execute(
            "PRAGMA table_info(usuarios)"
        ).fetchall()

        nombres_columnas = [columna["name"] for columna in columnas]

        if "correo" not in nombres_columnas:
            cursor.execute(
                "ALTER TABLE usuarios ADD COLUMN correo TEXT"
            )

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS calculos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                tipo_calculo TEXT NOT NULL,
                datos_entrada TEXT NOT NULL,
                resultados TEXT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
        """)

        conexion.commit()

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()


if __name__ == "__main__":
    crear_tablas()
    print("Base de datos actualizada correctamente.")
