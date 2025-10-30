import os
import redis

#r = redis.Redis(host='localhost', port=6379, decode_responses=True)
redis_host = os.getenv("REDIS_HOST", "redis")  
r = redis.Redis(host=redis_host, port=6379, decode_responses=True)


def borrar_todos_los_pedidos():
    pedidos_ids = r.lrange("pedidos", 0, -1)
    for pid in pedidos_ids:
        r.delete(f"pedido:{pid}")
    r.delete("pedidos")  # Borra la lista de IDs
    r.delete("pedido:id")  # Reinicia el contador de ID 

if __name__ == "__main__":
    borrar_todos_los_pedidos()
    print("Pedidos eliminados.")



# FALTA CRONEARLO