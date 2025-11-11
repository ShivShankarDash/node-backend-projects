import "./index.css";
import MarkdownTool from "./components/MarkdownTool";

export function App() {
  const handleGrammarCheck = async (file: { name: string; size: number; content: string }): Promise<string> => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/check-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: file.content }),
      });
      
      if (!res.ok) {
        throw new Error(`Grammar check failed: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Format results as a string to display in text area
      const issuesList = data.matches.length > 0 
        ? data.matches.map((match: any, index: number) => 
            `${index + 1}. ${match.message}\n   Suggestion: ${match.replacements?.[0]?.value || 'No suggestion'}\n   Context: "${match.context?.text || match.word}"`
          ).join('\n\n')
        : 'No grammar issues found!';
      
      return `Grammar Check Results for "${file.name}"\n\n` +
             `Total Issues: ${data.summary.totalIssues}\n` +
             `Language: ${data.language?.name || 'Unknown'}\n` +
             `Software: ${data.software?.name || 'LanguageTool'}\n\n` +
             `Issues:\n${issuesList}`;
            
    } catch (err: any) {
      console.error('Grammar check error:', err);
      throw err;
    }
  };

  const handleRenderHtml = async (file: { name: string; size: number; content: string }): Promise<string> => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/markdown/html-renderer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: file.content }),
      });
      
      if (!res.ok) {
        throw new Error(`HTML rendering failed: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      return data.renderedHtml;
            
    } catch (err: any) {
      console.error('HTML rendering error:', err);
      throw err;
    }
  };

  return <MarkdownTool onCheckGrammar={handleGrammarCheck} onRenderHtml={handleRenderHtml} />;
}

export default App;
