FROM python:3.5
RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip3 install psycopg2
RUN apt-get autoremove -y gcc
COPY test_script.py /src/test_script.py
CMD [ "python", "/src/test_script.py" ]
