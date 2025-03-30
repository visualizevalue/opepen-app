interface Version {
  id: number
  prompt: string
  timestamp: string
  imageUrl?: string
  imageData?: string
}

const useStorage = () => {
  const DB_NAME = 'opepen-app'
  const DB_VERSION = 3
  const STORE_NAME = 'versions'
  const IMAGE_STORE_NAME = 'images'
  const SELECTED_HISTORY_KEY = 'selected-history'

  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create versions store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Create images store
        if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
          db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }

  const saveVersions = async (versions: Version[]) => {
    console.log('Starting saveVersions with:', versions)

    const db = (await initDB()) as IDBDatabase
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME, IMAGE_STORE_NAME], 'readwrite')
      const versionsStore = transaction.objectStore(STORE_NAME)
      const imagesStore = transaction.objectStore(IMAGE_STORE_NAME)

      // Clear existing versions first
      const clearRequest = versionsStore.clear()
      clearRequest.onsuccess = () => {
        console.log('Store cleared successfully')

        // Save versions and their image data
        const requests = versions.map((version) => {
          console.log('Saving version:', version)

          // Save version metadata
          const versionRequest = versionsStore.put({
            id: version.id,
            prompt: version.prompt,
            timestamp: version.timestamp,
            imageUrl: version.imageUrl,
          })

          // Save image data if it exists
          if (version.imageData) {
            const imageRequest = imagesStore.put({
              id: version.id,
              data: version.imageData,
            })
            return Promise.all([
              new Promise((resolve, reject) => {
                versionRequest.onsuccess = () => resolve(versionRequest.result)
                versionRequest.onerror = () => reject(versionRequest.error)
              }),
              new Promise((resolve, reject) => {
                imageRequest.onsuccess = () => resolve(imageRequest.result)
                imageRequest.onerror = () => reject(imageRequest.error)
              }),
            ])
          }
          return new Promise((resolve, reject) => {
            versionRequest.onsuccess = () => resolve(versionRequest.result)
            versionRequest.onerror = () => reject(versionRequest.error)
          })
        })

        Promise.all(requests)
          .then(() => {
            console.log('All versions saved successfully')
            transaction.oncomplete = () => {
              console.log('Transaction completed successfully')
              resolve(true)
            }
            transaction.onerror = (error) => {
              console.error('Transaction error:', error)
              reject(error)
            }
          })
          .catch((error) => {
            console.error('Error saving versions:', error)
            reject(error)
          })
      }
      clearRequest.onerror = (error) => {
        console.error('Error clearing store:', error)
        reject(error)
      }
    })
  }

  const loadVersions = async () => {
    console.log('Starting loadVersions')
    const db = (await initDB()) as IDBDatabase
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME, IMAGE_STORE_NAME], 'readonly')
      const versionsStore = transaction.objectStore(STORE_NAME)
      const imagesStore = transaction.objectStore(IMAGE_STORE_NAME)
      const request = versionsStore.getAll()

      request.onsuccess = () => {
        const versions = request.result || []
        console.log('Loaded versions from store:', versions)

        // Load image data for each version
        const imageRequests = versions.map(
          (version) =>
            new Promise<Version>((resolve) => {
              const imageRequest = imagesStore.get(version.id)
              imageRequest.onsuccess = () => {
                if (imageRequest.result) {
                  version.imageData = imageRequest.result.data
                }
                resolve(version as Version)
              }
              imageRequest.onerror = () => {
                console.error('Error loading image data for version:', version.id)
                resolve(version as Version)
              }
            }),
        )

        Promise.all(imageRequests)
          .then((versionsWithImages: Version[]) => {
            // Sort by timestamp in descending order, keeping v0 at the end
            const v0 = versionsWithImages.find((v) => v.id === 0)
            const otherVersions = versionsWithImages
              .filter((v) => v.id !== 0)
              .sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
              )

            resolve(v0 ? [...otherVersions, v0] : otherVersions)
          })
          .catch((error) => {
            console.error('Error loading image data:', error)
            reject(error)
          })
      }
      request.onerror = (error) => {
        console.error('Error loading versions:', error)
        reject(error)
      }
      transaction.onerror = (error) => {
        console.error('Transaction error:', error)
        reject(error)
      }
    })
  }

  const saveSelectedHistory = async (index: number | null) => {
    localStorage.setItem(SELECTED_HISTORY_KEY, JSON.stringify(index))
  }

  const loadSelectedHistory = async () => {
    const saved = localStorage.getItem(SELECTED_HISTORY_KEY)
    return saved ? JSON.parse(saved) : null
  }

  return {
    saveVersions,
    loadVersions,
    saveSelectedHistory,
    loadSelectedHistory,
  }
}

export default useStorage
