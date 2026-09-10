import { useState } from 'react'
import Icon from './Icon'
import './ApiTest.css'

const API_BASE_URL = 'https://api.wayvote.org'

const ENDPOINTS = [
  { method: 'GET', path: '/', desc: 'API information and available endpoints' },
  { method: 'POST', path: '/helloworld', desc: 'Echoes posted content with a hello world message' },
  {
    method: 'POST',
    path: '/getRankings',
    desc: 'Ranks content against custom weights. Requires ids and customRanking.',
  },
  { method: 'POST', path: '/upVote', desc: 'Upvote content. Requires contentId.' },
  { method: 'POST', path: '/downVote', desc: 'Downvote content. Requires contentId.' },
]

const ApiTest = () => {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState('{"message": "Hello from frontend!"}')
  const [contentId, setContentId] = useState('content1')
  const [rankingData, setRankingData] = useState(
    JSON.stringify(
      {
        ids: ['content1', 'content2', 'content3'],
        customRanking: [
          {
            weighName: 'IQ',
            weighValue: 10,
          },
          {
            weighName: 'Experience',
            weighValue: 5,
          },
        ],
      },
      null,
      2
    )
  )

  const testApiRoot = async () => {
    setLoading(true)
    setResponse('')

    try {
      const response = await fetch(`${API_BASE_URL}/`)
      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testHelloWorld = async () => {
    setLoading(true)
    setResponse('')

    try {
      const response = await fetch(`${API_BASE_URL}/helloworld`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: testData,
      })

      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testGetRankings = async () => {
    setLoading(true)
    setResponse('')

    try {
      const response = await fetch(`${API_BASE_URL}/getRankings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: rankingData,
      })

      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testUpVote = async () => {
    setLoading(true)
    setResponse('')

    try {
      const response = await fetch(`${API_BASE_URL}/upVote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId }),
      })

      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testDownVote = async () => {
    setLoading(true)
    setResponse('')

    try {
      const response = await fetch(`${API_BASE_URL}/downVote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId }),
      })

      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearResponse = () => {
    setResponse('')
  }

  return (
    <div className="api-test">
      <div className="page-head">
        <div className="container">
          <p className="eyebrow eyebrow--inverse">Developers</p>
          <h1>API console</h1>
          <p className="lead">
            Exercise the WayVote ranking and voting endpoints directly against production.
          </p>
          <p className="api-base">
            <span>Base URL</span>
            <code>{API_BASE_URL}</code>
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="console-grid">
          <div className="console-main">
            <section className="panel">
              <h2 className="panel-title">Request payloads</h2>

              <div className="form-group">
                <label htmlFor="testData" className="form-label">
                  Hello world body
                </label>
                <textarea
                  id="testData"
                  className="form-control"
                  rows="3"
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  placeholder='{"message": "Hello from frontend!"}'
                  spellCheck="false"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contentId" className="form-label">
                  Content ID for voting
                </label>
                <input
                  id="contentId"
                  type="text"
                  className="form-control"
                  value={contentId}
                  onChange={(e) => setContentId(e.target.value)}
                  placeholder="content1"
                  spellCheck="false"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rankingData" className="form-label">
                  Ranking body
                </label>
                <textarea
                  id="rankingData"
                  className="form-control"
                  rows="10"
                  value={rankingData}
                  onChange={(e) => setRankingData(e.target.value)}
                  placeholder='{"ids": ["content1"], "customRanking": [{"weighName": "IQ", "weighValue": 10}]}'
                  spellCheck="false"
                />
              </div>
            </section>

            <section className="panel">
              <h2 className="panel-title">Send a request</h2>
              <div className="button-group">
                <button className="btn btn-secondary" onClick={testApiRoot} disabled={loading}>
                  API root
                </button>
                <button className="btn btn-secondary" onClick={testHelloWorld} disabled={loading}>
                  Hello world
                </button>
                <button className="btn btn-primary" onClick={testGetRankings} disabled={loading}>
                  Get rankings
                </button>
                <button className="btn btn-secondary" onClick={testUpVote} disabled={loading}>
                  Upvote
                </button>
                <button className="btn btn-secondary" onClick={testDownVote} disabled={loading}>
                  Downvote
                </button>
              </div>
            </section>

            <section className="panel panel--response">
              <div className="response-head">
                <h2 className="panel-title">Response</h2>
                <button
                  className="link-button"
                  onClick={clearResponse}
                  disabled={loading || !response}
                >
                  Clear
                </button>
              </div>
              <pre className="response-box" aria-live="polite">
                {loading ? (
                  <span className="response-loading">
                    <span className="spinner"></span> Awaiting response…
                  </span>
                ) : (
                  response || <span className="response-empty">No request sent yet.</span>
                )}
              </pre>
            </section>
          </div>

          <aside className="console-aside">
            <h2 className="panel-title">Endpoints</h2>
            <ul className="endpoints">
              {ENDPOINTS.map(({ method, path, desc }) => (
                <li key={`${method} ${path}`}>
                  <p className="endpoint-sig">
                    <span className={`verb verb--${method.toLowerCase()}`}>{method}</span>
                    <code>{path}</code>
                  </p>
                  <p className="endpoint-desc">{desc}</p>
                </li>
              ))}
            </ul>
            <p className="console-note">
              <Icon name="code" size={15} />
              Requests run from your browser against the live production API.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ApiTest
