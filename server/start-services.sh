#! /bin/bash
sudo systemctl start rabbitmq-server  # start rabbitmq task queue
celery -A server worker -l info &      # start celery 
celery -A server flower --loglevel=info &  # start flower @ http://localhost:5555 for task status
celery -A server beat -l INFO  &  # start celery beat for triggering jobs