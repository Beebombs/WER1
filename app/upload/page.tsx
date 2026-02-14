'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const MAX_SIZE_MB = 25;
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export default function UploadPage() {
  const params = useSearchParams();
  const pet = params.get('pet');
  const petType = pet === 'dog' || pet === 'cat' ? pet : null;

  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => !!petType && !!file && !!email && !loading, [petType, file, email, loading]);

  async function handleCheckout() {
    if (!petType || !file) return;

    setError('');
    setLoading(true);

    try {
      const signRes = await fetch('/api/uploads/sign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, fileSize: file.size })
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || 'Could not prepare upload');

      const uploadRes = await fetch(signData.uploadUrl, {
        method: 'PUT',
        headers: { 'content-type': file.type },
        body: file
      });
      if (!uploadRes.ok) throw new Error('Upload failed, please try again.');

      const submissionRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          petType,
          email,
          videoKey: signData.key,
          videoUrl: signData.publicUrl,
          videoMime: file.type,
          videoSize: file.size,
          originalFilename: file.name
        })
      });
      const submissionData = await submissionRes.json();
      if (!submissionRes.ok) throw new Error(submissionData.error || 'Could not create submission');

      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ submissionId: submissionData.id })
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error || 'Could not start checkout');

      window.location.href = checkoutData.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  }

  if (!petType) {
    return <main><div className="container card"><p>Please choose dog or cat from the home page.</p></div></main>;
  }

  return (
    <main>
      <div className="container card" style={{ display: 'grid', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Upload your {petType} video</h1>
        <p className="small">Aim for 5 seconds. Max {MAX_SIZE_MB}MB. Try to capture face + body.</p>

        <label>
          Email
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Video file (.mp4, .mov, .webm)
          <input
            className="input"
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              if (!selected) return setFile(null);
              if (!ALLOWED_TYPES.includes(selected.type)) {
                setError('Unsupported video type. Use .mp4, .mov, or .webm.');
                return;
              }
              if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(`File too large. Max ${MAX_SIZE_MB}MB.`);
                return;
              }
              setError('');
              setFile(selected);
            }}
          />
        </label>

        {error ? <p className="error">{error}</p> : null}

        <button className="button" disabled={!canSubmit} onClick={handleCheckout}>
          {loading ? 'Preparing checkout…' : 'Upload and pay £1'}
        </button>
      </div>
    </main>
  );
}
