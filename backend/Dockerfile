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
#
# java.net.preferIPv4Stack=true: protecao extra -- um pedido real chegou a sair diretamente por
# IPv6 do Render em vez de passar pelo proxy da DingConnect (bug de routing corrigido no
# DingConnectService), o que contornou silenciosamente o proxy e foi bloqueado pela Cloudflare.
# Com IPv6 desativado na JVM, qualquer futura falha de routing semelhante falha de forma limpa
# (sem rota direta disponivel) em vez de escapar pela Cloudflare sem ninguem reparar.
ENTRYPOINT ["java", "-Djdk.http.auth.tunneling.disabledSchemes=", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]
