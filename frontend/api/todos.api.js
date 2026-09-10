const API_URL = `http://${window.location.hostname}:8055/api/todos`;

export async function addTodo(text) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ text })
    })

    const data = await response.json();

    if (response.ok) {
        return data
    } else {
        throw new Error(data.message || "Could not fetch Todo");
    }
}

export async function getTodo() {
    const response = await fetch(API_URL, {
        method: "GET",
    })

    const data = await response.json();

    if (response.ok) {
        return data
    } else {
        throw new Error(data.message || "Could not found Todo");
    }
}

export async function updateStatus(id,completed) {
 
    
        const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
             headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ completed })
    })

   const data = await response.json();
    if (response.status === 200) {
        return data
    } else {
        throw new Error(data.message || "Could not update Todo");
    }

}

export async function deleteTodo(id) {
    console.log(id);
    
        const response = await fetch(`${API_URL}/${id}`, {
        method: "delete",
    })

   const data = await response.json();
    if (response.ok) {
        return data
    } else {
        throw new Error(data.message || "Could not delete Todo");
    }

}