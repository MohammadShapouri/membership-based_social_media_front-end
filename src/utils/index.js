export const timeSince = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }

    return Math.floor(seconds) + " seconds";
};

export const client = (endpoint, { body, ...customConfig } = {}) => {
    const headers = {};

    const config = {
        method: body ? "POST" : "GET",
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
        credentials: "include",
    };

    if (body) {
        if (body instanceof FormData) {
        // Let the browser set Content-Type automatically
        config.body = body;
        } else {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(body);
        }
    }

    return fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, config).then(
        async (res) => {
            if (res.ok) {
                if (config.method != "DELETE") {
                    const data = await res.json();
                    return data;
                }
            } else {
                const data = await res.json();
                return Promise.reject(data);
            }
        }
    );
};

export const uploadImage = (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mtzhxnqp");

    return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: "POST",
        body: data,
        credentials: "include",
    }).then((res) => res.json());
};

