import {createStackNavigator} from "react-navigation";
import OrderStatuses from "./components/order_statuses/OrderStatuses";
import Customers from "./components/customers/Customers";
import ChairTypes from "./components/chair_types/ChairTypes";
import Chairs from "./components/chairs/Chairs";

export const AdNav = createStackNavigator({
        Home: {
            screen: ChairTypes,
            navigationOptions: {
                title: "Chair Types",
            }
        },

        OrderStatuses: {
            screen: OrderStatuses,
            navigationOptions: {
                title: 'Order Statuses',
            }
        },

        Customers: {
            screen: Customers,
            navigationOptions: {
                title: 'Customers',
            }
        },

        Chairs: {
            screen: Chairs,
            navigationOptions: {
                title: 'Chairs',
            }
        },

    }
);