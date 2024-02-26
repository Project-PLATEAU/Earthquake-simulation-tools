FROM public.ecr.aws/lambda/python:3.11

# environment variable
ARG POSTGIS_HOST
ENV POSTGIS_HOST ${POSTGIS_HOST}
ARG POSTGIS_PORT
ENV POSTGIS_PORT ${POSTGIS_PORT}
ARG POSTGIS_DBNAME
ENV POSTGIS_DBNAME ${POSTGIS_DBNAME}
ARG POSTGIS_USER
ENV POSTGIS_USER ${POSTGIS_USER}
ARG POSTGIS_PASSWORD
ENV POSTGIS_PASSWORD ${POSTGIS_PASSWORD}
ARG EARTHQUAKE_PRESET_S3_BUCKET
ENV EARTHQUAKE_PRESET_S3_BUCKET ${EARTHQUAKE_PRESET_S3_BUCKET}
ARG SIGNED_URL_EXPIRES_IN
ENV SIGNED_URL_EXPIRES_IN ${SIGNED_URL_EXPIRES_IN}

RUN pip install --upgrade pip \
    && pip install poetry \
    && poetry config virtualenvs.create false

# COPY ./.env /app
COPY ./pyproject.toml ./poetry.lock* ./

# export requirements.txt from poetry pyproject.toml.
RUN poetry export --without-hashes --output requirements.txt

# Install the specified packages
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy function code
# COPY ./src/server.py ${LAMBDA_TASK_ROOT}
# COPY ./src/config.py ${LAMBDA_TASK_ROOT}
COPY . ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
# CMD [ "server.handler" ]
CMD [ "src.server.handler" ]
