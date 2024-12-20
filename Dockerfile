# Use uma imagem oficial do Node.js
FROM node:20

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos necessários
COPY package.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Exponha as portas usadas pelo Expo
EXPOSE 8080

# Comando para rodar o servidor Expo
CMD ["npx", "expo", "start", "--tunnel"]
