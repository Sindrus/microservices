import psycopg2
print("Connecting to Postgres...")

conn_string = "host='psqltodo' dbname='todo' user='postgres'"
print("conn string", conn_string)
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

