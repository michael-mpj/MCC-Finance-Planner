import { gapi } from "gapi-script";

export const initGapi = async () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", async () => {
      try {
        await gapi.client.init({
          apiKey,
          clientId,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
          scope: "https://www.googleapis.com/auth/drive.file",
        });
        resolve(gapi);
      } catch (err) {
        reject(err);
      }
    });
  });
};

export const uploadToGoogleDrive = async (fileName, fileContent) => {
  const file = new Blob([fileContent], { type: "application/json" });
  const metadata = {
    name: fileName,
    mimeType: "application/json",
  };
  
  const accessToken = gapi.auth2.getAuthInstance()
    .currentUser.get().getAuthResponse().access_token;
    
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: form,
    }
  );
  
  return response.json();
};
