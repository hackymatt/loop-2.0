docker build -t loopedupl/broker:latest broker
docker push loopedupl/broker:latest

kubectl delete pod <pod-name>
kubectl port-forward <pod-name> 3000:3000
