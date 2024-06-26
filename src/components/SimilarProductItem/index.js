// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {imageUrl, title, price, brand, rating} = similarProductDetails

  return (
    <li className="list-item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className=" similar-product-brand">by {brand}</p>
      <div className="price-rating-container">
        <h1 className="price-heading">RS. {price}</h1>
        <div className="rating-container">
          <p className="rating-heading">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
