import { useEffect, useState } from 'react'
import Dictation from '../component/Dictation'
import { API_BASE_URL } from '../../../config/api'

function TNPlus() {
  const [vocabList, setVocabList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTNPlus = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/Vocabularies/tn-plus`)
        if (!response.ok) {
          throw new Error(`Failed to load TN+ (${response.status})`)
        }
        const result = await response.json()
        const list = Array.isArray(result) ? result : []
        setVocabList(list)
      } catch (err) {
        setError(err.message)
        setVocabList([])
      } finally {
        setLoading(false)
      }
    }

    fetchTNPlus()
  }, [])

  return (
    <div className="container py-3">
      <h1 className="text-center mb-3">Dictation TN+</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-danger">Error: {error}</div>}
      {!loading && !error && (
        <Dictation
          key={`tnplus-${vocabList.length}`}
          vocabList={vocabList}
          onUpdateList={setVocabList}
        />
      )}
    </div>
  )
}

export default TNPlus
