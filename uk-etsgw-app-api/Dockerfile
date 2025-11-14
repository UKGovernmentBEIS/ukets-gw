FROM eclipse-temurin:21-jre
RUN apt-get update
RUN apt-get install -y openssh-client
RUN fc-cache -f -v
COPY target/uk-etsgw-app-api-env_version.jar /opt/applications/uk-etsgw-app-api/
RUN groupadd -g 499 etsgw && useradd -m -r -u 499 -g etsgw etsgw
USER etsgw
WORKDIR /opt/applications/uk-etsgw-app-api/
CMD ["/bin/bash", "-c", "sleep 15 && java -XX:+PrintFlagsFinal -Xmx1024m -Xms512m -jar uk-etsgw-app-api-env_version.jar"]
