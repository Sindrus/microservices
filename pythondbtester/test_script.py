import psycopg2
print("Connecting to Postgres...")

conn_string = "host='psqltodo_psql_1' dbname='todo' user='postgres'"
conn = psycopg2.connect(conn_string)

cur = conn.cursor()
print("Connected")

cur.execute("INSERT INTO todo (note, done) VALUES('nanana', False)")
conn.commit()

cur.execute("SELECT * FROM todo")
rows = cur.fetchall()

for row in rows:
    print(row)

conn.close()

