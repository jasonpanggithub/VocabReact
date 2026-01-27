import { useEffect, useState } from 'react'
import Dictation from '../component/Dictation'
import { API_BASE_URL } from '../../../config/api'

function ByFail() {
  const [vocabList, setVocabList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFailed = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/Vocabularies/failed-to-test`)
        if (!response.ok) {
          throw new Error(`Failed to load failed vocabularies (${response.status})`)
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

    fetchFailed()
  }, [])

  return (
    <div className="container py-3">
      <h1 className="text-center mb-3">Dictation By Fail</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-danger">Error: {error}</div>}
      {!loading && !error && (
        <Dictation
          key={`byfail-${vocabList.length}`}
          vocabList={vocabList}
          onUpdateList={setVocabList}
        />
      )}
    </div>
  )
}

export default ByFail
