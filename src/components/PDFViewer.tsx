type Props = { pdf_url: string }

const PDFViewer = ({ pdf_url }: Props) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-100 dark:border-gray-600 bg-white dark:bg-black-700">
      <iframe src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`} className="w-full h-full"></iframe>
    </div>
  )
}

export default PDFViewer


