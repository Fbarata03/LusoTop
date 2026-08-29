package com.lusotop.api.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

/**
 * Carrega variáveis de ambiente do arquivo .env automaticamente na inicialização.
 * As variáveis podem estar em:
 * 1. Variáveis de ambiente do sistema (mais alta prioridade)
 * 2. Arquivo .env no diretório raiz do projeto
 * 3. Valores padrão definidos em application.yml
 */
@Configuration
public class EnvConfig {

    public EnvConfig() {
        // Carrega o arquivo .env apenas se existir
        // Se uma variável já está definida no sistema, a biblioteca dotenv NÃO sobrescreve
        try {
            Dotenv dotenv = Dotenv.configure()
                    .filename(".env")
                    .load();
        } catch (Exception e) {
            // .env não encontrado ou erro ao ler — não é problema fatal
            // As variáveis de ambiente podem estar configuradas no sistema ou na plataforma
        }
    }
}
