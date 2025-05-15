Build docker:
docker build -t loopedupl/broker:latest broker

Push docker:
docker push loopedupl/broker:latest

Delete pod:
kubectl delete pod <pod-name>

Port forward:
kubectl port-forward <pod-name> 3000:3000

Create secrets:
kubectl delete secret secrets

kubectl create secret generic rabbitmq-secrets --from-env-file=./rabbitmq-secrets.sh
