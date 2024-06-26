import {Component} from 'react'

import Cookies from 'js-cookie'

import {Loader} from 'react-loader-spinner'

import {BsPlusSquare, BsFileMinus} from 'react-icons/bs'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConsts = {
  intial: 'INTIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    quantityOfProducts: 1,
    apiStatus: apiStatusConsts.intial,
    similarProductsList: [],
    productItemList: {},
    displayText: 1,
  }

  componentDidMount() {
    this.getProductItemList()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    style: data.style,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    availability: data.availability,
  })

  getProductItemList = async () => {
    this.setState({apiStatus: apiStatusConsts.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const productDetails = this.getFormattedData(fetchedData)
      const similarProducts = fetchedData.similar_products.map(eachItem =>
        this.getFormattedData(eachItem),
      )

      this.setState({
        productItemList: productDetails,
        similarProductsList: similarProducts,
        apiStatusConsts: apiStatusConsts.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConsts.failure})
    }
  }

  onIncrease = () => {
    this.setState(prevState => ({displayText: prevState.displayText + 1}))
  }

  onDecrease = () => {
    const {displayText} = this.state
    if (displayText > 1) {
      this.setState(prevState => ({displayText: prevState.displayText - 1}))
    }
  }

  renderOfSimilarProducts = () => {
    const {similarProductsList} = this.state
    return (
      <ul>
        {similarProductsList.map(eachProduct => (
          <SimilarProductItem
            similarProductDetails={eachProduct}
            key={eachProduct.id}
          />
        ))}
      </ul>
    )
  }

  renderOfFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-view-container"
      />
      <h1 className="error-heading">Product not found</h1>
      <button className="error-btn">Continue Shopping</button>
    </div>
  )

  renderOfLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderofProductItem = () => {
    const {productItemList, similarProductsList, displayText} = this.state
    const {
      id,
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productItemList
    return (
      <div className="product-item-bg-container">
        <div className="product-img-description-container">
          <img src={imageUrl} className="product-image" alt={title} />
          <div className="description-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-and-reviews-container">
              <div className="rating-star-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p className="availability">
              <span className="highlate">Available:</span>
              {availability}
            </p>
            <p className="availability">
              <span className="highlate">Brand:</span>
              {brand}
            </p>
            <hr className="hr-line" />
            <div className="add-to-cart-container">
              <BsPlusSquare onClick={this.onIncrease} />
              <p>{displayText}</p>
              <BsFileMinus onClick={this.onDecrease} />
            </div>
            <button className="add-to-cart-container">ADD TO CART</button>
            <h1>Similar Products</h1>
            <ul className="similar-products-list">
              {similarProductsList.map(eachProduct => (
                <SimilarProductItem
                  similarProductDetails={eachProduct}
                  key={eachProduct.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderOfProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConsts.success:
        return this.renderofProductItem()
      case apiStatusConsts.failure:
        return this.renderOfFailureView()
      case apiStatusConsts.inProgress:
        return this.renderOfLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details">
        <Header />
        {this.renderOfProductDetails()}
      </div>
    )
  }
}
export default ProductItemDetails
