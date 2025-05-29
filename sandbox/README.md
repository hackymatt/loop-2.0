Build docker:
docker build -t loopedupl/<technology>-sandbox:latest sandbox/<technology>

Push docker:
docker push loopedupl/<technology>-sandbox:latest

Delete pod:
kubectl delete pod <pod-name>

Create secrets:
kubectl delete secret secrets --namespace=sandbox

kubectl create secret generic rabbitmq-secrets --from-env-file=./rabbitmq-secrets.sh --namespace=sandbox
