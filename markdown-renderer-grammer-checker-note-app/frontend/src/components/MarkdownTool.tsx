import React, { useRef, useState } from "react";

interface SelectedFile {
  name: string;
  size: number;
  content: string;
}

interface MarkdownToolProps {
  onCheckGrammar?: (file: SelectedFile) => Promise<string>;
  onRenderHtml?: (file: SelectedFile) => Promise<string>;
}

interface StoredFile {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const MarkdownTool: React.FC<MarkdownToolProps> = ({ onCheckGrammar, onRenderHtml }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [allFiles, setAllFiles] = useState<StoredFile[]>([]);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [grammarResults, setGrammarResults] = useState<string>("");
  const [renderedHtml, setRenderedHtml] = useState<string>("");

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // only allow .md by checking the name and type
    if (!file.name.endsWith(".md") && file.type !== "text/markdown") {
      alert("Please select a .md markdown file");
      e.currentTarget.value = "";
      return;
    }

    const text = await file.text();
    setSelected({ name: file.name, size: file.size, content: text });
  };

  const handleCheckGrammar = async () => {
    if (!selected) {
      setGrammarResults("Please upload a markdown file first.");
      return;
    }
    if (onCheckGrammar) {
      setGrammarResults("Checking grammar...");
      try {
        const result = await onCheckGrammar(selected);
        setGrammarResults(result);
      } catch (error: any) {
        setGrammarResults(`Grammar check failed: ${error?.message || error}`);
      }
    } else {
      setGrammarResults("No grammar handler provided. Call your API from the parent component.");
    }
  };

  const handleRenderHtml = async () => {
    if (!selected) {
      setRenderedHtml("Please upload a markdown file first.");
      return;
    }
    if (onRenderHtml) {
      setRenderedHtml("Rendering HTML...");
      try {
        const result = await onRenderHtml(selected);
        setRenderedHtml(result);
      } catch (error: any) {
        setRenderedHtml(`HTML rendering failed: ${error?.message || error}`);
      }
    } else {
      setRenderedHtml("No render handler provided. Call your API from the parent component.");
    }
  };

  const fetchAllFiles = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/markdown/all");
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const files = await res.json();
      setAllFiles(files);
      setShowAllFiles(true);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to fetch files: ${err?.message || err}`);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1 style={{ color: "#111827", marginBottom: 12 }}>Markdown Tools</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button onClick={openFilePicker} style={buttonStyle}>
          Upload markdown file
        </button>
        { /* Upload to server button appears after a file is selected */ }
        <button
          onClick={async () => {
            if (!selected) return alert("Please select a markdown file first.");
            try {
              const res = await fetch("http://localhost:3000/api/v1/markdown/note-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([selected.name, selected.content]),
              });
              if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
              }
              const data = await res.json();
              alert(`Uploaded successfully. id: ${data}`);
            } catch (err: any) {
              console.error(err);
              alert(`Upload failed: ${err?.message || err}`);
            }
          }}
          style={buttonStyle}
        >
          Send to server
        </button>

        <button onClick={handleCheckGrammar} style={buttonStyle}>
          Check grammar
        </button>

        <button onClick={handleRenderHtml} style={buttonStyle}>
          Render HTML
        </button>

        <button onClick={fetchAllFiles} style={buttonStyle}>
          View All Files
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,text/markdown"
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      {selected && (
        <div style={{ marginTop: 12 }}>
          <strong>Selected:</strong> {selected.name} • {(selected.size / 1024).toFixed(2)} KB
          <div style={{ marginTop: 8, background: "#f8fafc", padding: 12 }}>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{selected.content.slice(0, 1000)}</pre>
            {selected.content.length > 1000 && <div>…(truncated)</div>}
          </div>
        </div>
      )}

      {grammarResults && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "#111827", marginBottom: 8 }}>Grammar Check Results:</h3>
          <textarea
            value={grammarResults}
            readOnly
            style={{
              width: "100%",
              height: "200px",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              background: "#f9fafb",
              fontFamily: "monospace",
              fontSize: "14px",
              color: "#374151",
              resize: "vertical"
            }}
          />
        </div>
      )}

      {renderedHtml && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12, gap: 12 }}>
            <h3 style={{ color: "#111827", margin: 0 }}>HTML Renderer:</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setRenderedHtml("")}
                style={{ ...buttonStyle, fontSize: 12, padding: "6px 12px", background: "#dc2626" }}
              >
                Clear
              </button>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: "400px" }}>
            {/* HTML Source */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", color: "#6b7280", fontSize: 14 }}>HTML Source:</h4>
              <textarea
                value={renderedHtml}
                readOnly
                style={{
                  width: "100%",
                  height: "calc(100% - 30px)",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: "#f9fafb",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "#374151",
                  resize: "none"
                }}
              />
            </div>
            
            {/* Live Preview */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", color: "#6b7280", fontSize: 14 }}>Live Preview:</h4>
              <div
                style={{
                  width: "100%",
                  height: "calc(100% - 30px)",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: "#ffffff",
                  overflow: "auto",
                  fontSize: "14px",
                  lineHeight: "1.6"
                }}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          </div>
        </div>
      )}

      {showAllFiles && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ color: "#111827", margin: 0 }}>All Stored Files ({allFiles.length})</h2>
            <button 
              onClick={() => setShowAllFiles(false)} 
              style={{ ...buttonStyle, background: "#dc2626" }}
            >
              Hide Files
            </button>
          </div>
          
          {allFiles.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No files stored yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {allFiles.map((file) => (
                <div 
                  key={file.id} 
                  style={{ 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 8, 
                    padding: 16,
                    background: "#f9fafb"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                    <div>
                      <h3 style={{ margin: 0, color: "#111827", fontSize: 18 }}>{file.title}</h3>
                      <p style={{ margin: "4px 0", color: "#6b7280", fontSize: 14 }}>
                        ID: {file.id} • Created: {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelected({ 
                          name: file.title, 
                          size: file.content.length, 
                          content: file.content 
                        });
                        setShowAllFiles(false);
                      }}
                      style={{ ...buttonStyle, fontSize: 12, padding: "6px 12px" }}
                    >
                      Load
                    </button>
                  </div>
                  
                  <div style={{ background: "#fff", padding: 12, borderRadius: 4, border: "1px solid #e5e7eb" }}>
                    <pre style={{ 
                      whiteSpace: "pre-wrap", 
                      margin: 0, 
                      fontSize: 14,
                      color: "#374151",
                      maxHeight: 200,
                      overflow: "auto"
                    }}>
                      {file.content.slice(0, 500)}
                      {file.content.length > 500 && "..."}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default MarkdownTool;
