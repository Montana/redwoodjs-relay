import Header from "src/components/Header"

const NewsItemLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default NewsItemLayout
