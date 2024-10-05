FROM python:3.9-slim as builder
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app

FROM builder as tester
ENV TESTING=True
RUN pytest --junitxml=report.xml

FROM python:3.9-slim as production
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 5000

CMD ["python", "app.py"]