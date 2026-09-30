# ==========================================
# Stage 1: Build JAR with Maven & JDK 21
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven Wrapper và pom.xml để cache dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x ./mvnw
# Tải trước dependencies (layer caching)
RUN ./mvnw dependency:go-offline -B || true

# Copy toàn bộ mã nguồn và biên dịch package
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# ==========================================
# Stage 2: Minimal Runtime JRE 21
# ==========================================
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Tạo non-root user đảm bảo an toàn bảo mật
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy file jar từ build stage
COPY --from=builder /app/target/*.jar app.jar

# Biến môi trường mặc định
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
