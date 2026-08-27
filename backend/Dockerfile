FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/lusotop-api.jar app.jar
EXPOSE 8080
# jdk.http.auth.tunneling.disabledSchemes precisa de estar definido antes de qualquer classe do
# HttpClient carregar -- defini-lo em runtime (System.setProperty) pode chegar tarde de mais
# consoante a ordem de inicializacao dos beans do Spring. Como flag de arranque da JVM garante
# que fica ativo desde o inicio, sempre. Sem isto, pedidos autenticados atraves do proxy da
# DingConnect falham sempre com 407, mesmo com credenciais corretas.
ENTRYPOINT ["java", "-Djdk.http.auth.tunneling.disabledSchemes=", "-jar", "app.jar"]
