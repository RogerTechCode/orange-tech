// Initialize Firebase using the Compat CDN for global script compatibility
const firebaseConfig = {
    apiKey: "AIzaSyA1zDZzxVDZOBC8hVPbhSPp-Ng6Bbj1SNg",
    authDomain: "orange-fc-f854e.firebaseapp.com",
    projectId: "orange-fc-f854e",
    storageBucket: "orange-fc-f854e.firebasestorage.app",
    messagingSenderId: "258265114643",
    appId: "1:258265114643:web:45ccb5372aa2ccc9f837e6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Global Data Handling Utilities for Firebase
const Storage = {
    get: async (collectionName, autoSeed = true) => {
        try {
            const snapshot = await db.collection(collectionName).get();
            const items = [];
            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() });
            });

            // Auto-seed if empty and default data exists
            if (items.length === 0 && autoSeed && typeof DEFAULT_DATA !== 'undefined' && DEFAULT_DATA[collectionName]) {
                console.log(`Auto-seeding ${collectionName} with default data...`);
                await Storage.restoreDefaults(collectionName);
                return await Storage.get(collectionName, false); // Fetch again to get the new items with Firebase IDs
            }

            return items;
        } catch (e) {
            console.error(`Error reading ${collectionName} from Firebase:`, e);
            if (e.code === 'permission-denied') {
                alert(`Erro de permissão no Firebase. Verifique se as Regras do Firestore estão configuradas como 'public' ou se o período de teste expirou.`);
            }
            return [];
        }
    },
    add: async (collectionName, item) => {
        try {
            var saveItem = { ...item };
            delete saveItem.id; // ensure no undefined id is saved
            const docRef = await db.collection(collectionName).add(saveItem);
            item.id = docRef.id;
            return item;
        } catch (e) {
            console.error(`Error adding to ${collectionName}:`, e);
            alert(`Erro ao salvar no banco de dados. Verifique as permissões ou se a imagem é muito grande. Detalhe: ${e.message}`);
            return null;
        }
    },
    update: async (collectionName, id, newData) => {
        try {
            var saveItem = { ...newData };
            delete saveItem.id;
            await db.collection(collectionName).doc(id).update(saveItem);
            return true;
        } catch (e) {
            console.error(`Error updating ${id} in ${collectionName}:`, e);
            alert(`Erro ao atualizar no banco de dados. Detalhe: ${e.message}`);
            return false;
        }
    },
    delete: async (collectionName, id) => {
        try {
            await db.collection(collectionName).doc(id).delete();
            return true;
        } catch (e) {
            console.error(`Error deleting ${id} from ${collectionName}:`, e);
            return false;
        }
    },
    fileToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.8 quality to drastically reduce size for Firestore (1MB limit)
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataUrl);
                };
                img.onerror = error => reject(error);
            };
            reader.onerror = error => reject(error);
        });
    },
    restoreDefaults: async (key) => {
        if (typeof DEFAULT_DATA !== 'undefined' && DEFAULT_DATA[key]) {
            const items = DEFAULT_DATA[key];
            for (const item of items) {
                await Storage.add(key, item);
            }
            return true;
        }
        return false;
    }
};