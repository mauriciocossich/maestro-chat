import { http } from "./http";
import "./websocket/client";
import "./websocket/admin";

// http listen também já sobe o server ws imbutido, por isso não precisa de listen tbm
http.listen(3333, () => console.log("Server is running on port 3333"));
