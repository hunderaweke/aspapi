# Academic Papers Search API

**Base URL:**  
`https://aspapi.onrender.com`

---

## Endpoints

### 1. Search Academic Papers

**GET** `/api/papers`

Query academic papers using various filters.

#### Query Parameters

| Name           | Type    | Description                                                      |
|----------------|---------|------------------------------------------------------------------|
| `title`        | string  | Filter by paper title                                            |
| `abstract`     | string  | Filter by abstract                                               |
| `authors`      | string  | Comma-separated list of authors                                  |
| `contributors` | string  | Comma-separated list of contributors                             |
| `yearPublished`| string  | Year of publication                                              |
| `documentType` | string  | Type of document (e.g., article, thesis)                         |
| `doi`          | string  | Digital Object Identifier                                        |
| `publisher`    | string  | Publisher name                                                   |
| `arvixId`      | string  | Arvix ID                                                         |
| `magId`        | string  | MAG ID                                                           |
| `fullText`     | string  | Filter by full text                                              |
| `createdDate`  | string  | Creation date (format: YYYY-MM-DD)                               |
| `acceptedDate` | string  | Acceptance date (format: YYYY-MM-DD)                             |
| `limit`        | int     | Limit the number of results                                      |

#### Example Request

```http
GET https://aspapi.onrender.com/api/papers?title=deep%20learning&authors=John%20Doe,Jane%20Smith&yearPublished=2022&limit=5
```

#### Example Response

```json
[
  {
    "id": 123,
    "title": "Deep Learning for Academic Search",
    "authors": [{"name": "John Doe"}, {"name": "Jane Smith"}],
    "abstract": "This paper explores deep learning methods for academic search...",
    "publisher": "Science Press",
    "yearPublished": 2022,
    "doi": "10.1234/example.doi",
    "createdDate": "2022-01-15T00:00:00Z",
    "acceptedDate": "2022-02-01T00:00:00Z"
    // ...other fields...
  }
]
```

---

### 2. Academic Papers Chat Assistant

**POST** `/api/chat`

Ask questions about academic paper search.  
The assistant will only answer questions related to academic papers.

#### Request Body

```json
{
  "prompt": "Find papers about reinforcement learning in robotics."
}
```

#### Example Request

```http
POST https://aspapi.onrender.com/api/chat
Content-Type: application/json

{
  "prompt": "Find papers about reinforcement learning in robotics."
}
```

#### Example Response

```json
{
  "response": "Here are some recent papers about reinforcement learning in robotics: ..."
}
```

---

## Notes

- All responses are in JSON.
- For `/api/papers`, you can combine multiple filters as query parameters.
- For `/api/chat`, the assistant will politely refuse to answer unrelated questions.

---

**Contact:**  
For questions or issues, contact the backend maintainer.
