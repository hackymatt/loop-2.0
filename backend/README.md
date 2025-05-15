Build docker:
docker build -t loopedupl/backend:latest ./backend

Push docker:
docker push loopedupl/backend:latest

Create secrets:
kubectl delete secret secrets

kubectl create secret generic backend-secrets --from-env-file=./backend-secrets.sh
kubectl create secret generic postgres-secrets --from-env-file=./postgres-secrets.sh
kubectl create secret generic redis-secrets --from-env-file=./redis-secrets.sh
kubectl create secret generic s3-secrets --from-env-file=./s3-secrets .sh
kubectl create secret generic oauth-secrets --from-env-file=./oauth-secrets.sh
