import { toast } from 'sonner';

function copyToClipboard(text: string) {
    if (navigator.clipboard && window.isSecureContext) {
      // 现代浏览器支持
      return navigator.clipboard.writeText(text).then(() => {
        console.log("已复制到剪贴板:", text);
        toast.success(`${text} Copied to clipboard!`);
      }).catch(err => {
        console.error("复制失败:", err);
        toast.error('Failed to copy to clipboard');
      });
    } else {
      // 兼容旧浏览器
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";  // 避免页面滚动
      textArea.style.opacity = "0";       // 不可见
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        document.execCommand("copy");
        console.log("已复制到剪贴板:", text);
        toast.success(`${text} Copied to clipboard!`);
      } catch (err) {
        console.error("复制失败:", err);
        toast.error('Failed to copy to clipboard');
      }
  
      document.body.removeChild(textArea);
    }
  }
  

  export default copyToClipboard