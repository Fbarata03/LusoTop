FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# O DingConnectService chama a API da DingConnect atraves de um subprocesso curl (nao de um
# cliente HTTP nativo do Java) -- clientes HTTP Java (java.net.http.HttpClient e Apache
# HttpClient) foram ambos bloqueados pela Cloudflare da DingConnect mesmo vindo do IP na
# whitelist (assinatura TLS/HTTP reconhecida como nao-browser); o curl nunca falhou.
RUN apk add --no-cache curl
COPY --from=build /app/target/lusotop-api.jar app.jar
EXPOSE 8080
# java.net.preferIPv4Stack=true: protecao extra a nivel da JVM -- um pedido real ja chegou a sair
# diretamente por IPv6 do Render em vez de passar pelo proxy da DingConnect (bug de routing,
# corrigido), contornando silenciosamente o proxy e sendo bloqueado pela Cloudflare. Com IPv6
# desativado, qualquer chamada Java direta futura falha de forma limpa em vez de escapar sem
# ninguem reparar (nao afeta o curl, que gere a sua propria rede fora da JVM).
ENTRYPOINT ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]
