import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { filterSelector } from "../../redux/filter/selectors";
import { addProduct, removeProduct } from "../../redux/cart/slice";
import { PlusIcon } from "./svg/PlusIcon";
import { MinusIcon } from "./svg/MinusIcon";
import { ArrowIcon } from "./svg/ArrowIcon";
import Attributes from "../Attributes";

const mapStateToProps = (state) => ({
  currency: filterSelector(state).activeCurrency,
});

const mapDispatchToProps = (dispatch) => ({
  addProduct: bindActionCreators(addProduct, dispatch),
  removeProduct: bindActionCreators(removeProduct, dispatch),
});

class CartItem extends Component {
  static propTypes = {
    cartItem: PropTypes.object,
    currency: PropTypes.string,
    addProduct: PropTypes.func,
    decreaseCount: PropTypes.func,
  };

  static defaultProps = {
    cartItem: {},
    currency: "USD",
  };

  state = {
    activeIdx: 0,
  };

  handleAddProduct = () => {
    const { cartItem, addProduct } = this.props;
    const { activeAttributes } = cartItem;

    addProduct({ ...cartItem, activeAttributes });
  };

  handleDecreaseCount = () => {
    const { cartItem, removeProduct } = this.props;
    const { id, activeAttributes } = cartItem;
    removeProduct({ id, activeAttributes });
  };

  handleClickLeftArrow = () => {
    const { activeIdx } = this.state;
    const newIdx = activeIdx === 0 ? 0 : activeIdx - 1;
    this.setState({ activeIdx: newIdx });
  };

  handleClickRightArrow = () => {
    const { activeIdx } = this.state;
    const { gallery } = this.props.cartItem;
    const newIdx = activeIdx === gallery.length - 1 ? activeIdx : activeIdx + 1;
    this.setState({ activeIdx: newIdx });
  };

  renderPrices = () => {
    const { currency, cartItem } = this.props;
    const { prices } = cartItem;
    return prices.map((price, index) => {
      return (
        price.currency.label === currency && (
          <p key={index}>
            {price.currency.symbol}
            {price.amount}
          </p>
        )
      );
    });
  };

  render() {
    const { brand, name, attributes, count, gallery, activeAttributes } =
      this.props.cartItem;
    const { activeIdx } = this.state;

    return (
      <div className="cart-item">
        <div className="cart-item__content">
          <div className="cart-item__info">
            <div className="cart-item__title">
              <h1 className="cart-item__title--brand">{brand}</h1>
              <h1 className="cart-item__title--name">{name}</h1>
            </div>
            <div className="cart-item__price">{this.renderPrices()}</div>
            <Attributes
              attributes={attributes}
              activeAttributes={activeAttributes}
              isProduct={false}
              onSetAttrs={this.handleSetAttrs}
            />
          </div>
          <div className="cart-item__sidebar">
            <div className="cart-item__actions">
              <button onClick={this.handleAddProduct}>
                <div className="cart-item__actions--vectors">
                  <PlusIcon />
                </div>
              </button>
              <span>{count}</span>
              <button onClick={this.handleDecreaseCount}>
                <div className="cart-item__actions--vectors">
                  <MinusIcon />
                </div>
              </button>
            </div>
            <div className="cart-item__image">
              <img src={gallery[activeIdx]} alt="product" />
              {gallery.length > 1 && (
                <div className="cart-item__image--arrows">
                  <div onClick={() => this.handleClickLeftArrow()}>
                    <ArrowIcon rotate={0} />
                  </div>
                  <div onClick={() => this.handleClickRightArrow()}>
                    <ArrowIcon rotate={180} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
