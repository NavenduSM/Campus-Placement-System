FROM maven:3.9.9-eclipse-temurin-22 AS build
ARG SERVICE_PATH
WORKDIR /workspace

COPY . /workspace
RUN mvn -f "${SERVICE_PATH}/pom.xml" clean package -DskipTests

FROM eclipse-temurin:22-jre
ARG SERVICE_PATH
WORKDIR /app

COPY --from=build /workspace/${SERVICE_PATH}/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
