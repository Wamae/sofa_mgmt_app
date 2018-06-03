import {createStackNavigator} from "react-navigation";
import OrderStatuses from "./components/order_statuses/OrderStatuses";
import Customers from "./components/customers/Customers";
import ChairTypes from "./components/chair_types/ChairTypes";
import Chairs from "./components/chairs/Chairs";

export const AdNav = createStackNavigator({
        Home: {
            screen: ChairTypes
        },

        OrderStatuses: {
            screen: OrderStatuses
        },

        Customers: {
            screen: Customers
        },

        Chairs: {
            screen: Chairs
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);