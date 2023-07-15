### A File uploader that supports multiple concurrent file uploads with retry, cancel and rest of the case handlings.

### The Assessment:  
Develop a file uploader using state-machines.  
The uploading process consists of following steps:

1. Get a URL from an API where to upload a file. The response contains a unique id (e.g. UUID) and the destination URL.
2. Upload the file to destination URL.
3. Notify the API about completion.

On every step there may be a failure related to network, API, etc.  
It’s not needed to write backend, so please feel free to use mock functions which behave like a real API.

Requirements:
- it should support multiple uploads.
- It should support retries by user demand.
- It should support cancelation by user demand. After cancelation the requests should be canceled as well.
- It should provide an API to subscribe to the progress on the 2nd step.
- It should be written in TypeScript using state-machines (e.g. xstate).
- Basic UI written with React.
- Optional, but would be nice: Unit tests

Please pay attention multiple uploads and upload multiple files are not ​the same. Every ​file are ​uploaded and controlled individually. Users during any uploading can add more files or interrupt individually.
