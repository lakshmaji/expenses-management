### SOnarcube

```bash
# Issue #1
# sonarqube-1  | bootstrap check failure [1] of [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]; for more information see [https://www.elastic.co/guide/en/elasticsearch/reference/8.13/_maximum_map_count_check.html]

sysctl vm.max_map_count

sudo sysctl -w vm.max_map_count=262144


```

[Open it in broswer](http://localhost:9000/account/reset_password)
admin 
2woW4py~b9q}d8=,ku_3_w£

#analsys token
sqp_2bf24d537930064eeebf1241b7d2f696dc097580


instaling sonar scanner

```bash
# Docs https://docs.sonarsource.com/sonarqube/10.6/analyzing-source-code/scanners/sonarscanner/
# Downloaded it from https://docs.sonarsource.com/sonarqube/10.6/analyzing-source-code/scanners/sonarscanner/ (Linuxx64 and 6.2 version)
sudo unzip sonar-scanner-cli-4.8.0.2856-linux.zip
sudo mv sonar-scanner-4.8.0.2856-linux /opt/sonar-scanner
export PATH=$PATH:/opt/sonar-scanner/bin
source ~/.bashrc

docker compose up
cd /home/minions/development/apps/expense-mgmt

sonar-scanner \
  -Dsonar.projectKey=Testing-my-solution \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_639ad6860dee27796cd3810087938c6e5320a236
```