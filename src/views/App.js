/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, 
  Image, TouchableOpacity, TextInput, ScrollView} from 'react-native';

import { createStackNavigator } from 'react-navigation';
import { DATA } from '../constants';

class LogoTitle extends Component {
  render() {
    return (
      <Image
        source={require('../imgs/spyro.png')}
        style={{ width: 30, height: 30, alignItems: 'center'}}
      />
    );
  }
}

class ModalScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

class SeatchForm extends Component {

  render() {
    return (
      <View style={styles.searchView}>
        <TextInput
          style={styles.input2}
          placeholder="Digite o nome do Bairro em Recife"
        />
        <Button
          style={styles.button2}
          onPress={() => alert('This is a button!')}
          title="Ok"
        />
      </View>
    );
  }

}

class Itens extends Component {
  render() {
      return (
          <View style={styles.itens_item}>
              <View style={styles.itens_foto}>
                  <Image style={{ height: 100, width: 100 }} source={{ uri: 'http://via.placeholder.com/100x100'}} />
              </View>

              <View style={styles.itens_destalhesItem}>
                  <Text style={styles.itens_txtTitulo}>{this.props.item.cidade} - {this.props.item.nome}</Text>
                  <Text style={styles.itens_txtValor}>MAX: {this.props.item.previsao.max}</Text>
                  <Text style={styles.itens_txtValor}>MIN: {this.props.item.previsao.min}</Text>
                  <Text style={styles.itens_txtValor}>Favorito: Sim</Text>
              </View>
          </View>
      );
  }
}

class HomeScreen extends Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.header, styles.withBottomBorder]} >
          <SeatchForm />
        </View>
        <View style={styles.body} >
          <Text style={styles.titulo}>Favoritos</Text>
          <ScrollView style={{ backgroundColor: '#DDD' }}>
            { DATA.map( item => (<Itens key={item.nome} item={item} />)) }
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <Text>Inova Clima</Text>
        </View>
      </View>
    );
  }
}

class DetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('otherParam', 'A Nested Details Screen'),
    };
  };

  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', 'NO-ID');
    const otherParam = navigation.getParam('otherParam', 'some default value');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>itemId: {JSON.stringify(itemId)}</Text>
        <Text>otherParam: {JSON.stringify(otherParam)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Update the title"
          onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
        />
      </View>
    );
  }
}

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        //backgroundColor: '#f4511e',
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
        textAlign:'center',
      },
      title: 'Inova Clima',
      headerRight: (
        <TouchableOpacity onPress={() => alert('This is a button!')} style={{ flex: 1, marginRight: 25}}>
          <LogoTitle />
        </TouchableOpacity>        
      ),
    },
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  withBottomBorder: {
    borderBottomColor: '#00f',
    borderBottomWidth: 2
  },
  header: {
    flex: 1.2, backgroundColor: '#eee', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  body: {
    flex: 8, backgroundColor: 'white'
  },
  footer: {
    flex: .8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'steelblue',
  },
  searchView: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
  },
  titulo: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    marginBottom: 5
  },
  input: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    height: 40,
    width: 300,
    borderRadius: 3,
    marginTop: 10,
    fontSize: 12,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica',
  },
  input2: {
    backgroundColor: '#FFF',
    height: 40,
    width: 300,
    borderRadius: 3,
    marginTop: 10,
    fontSize: 12,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica',
  },
  button2: {
    height: 40,
    width: 40,
    borderRadius: 3,
    marginTop: 10,
    fontSize: 12,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica'
  },
  itens_item: {
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: '#999',
    margin: 10,
    padding: 10,
    flexDirection: 'row'
  },
  itens_foto: {
    width: 102,
    height: 102
  },
  itens_destalhesItem: {
    marginLeft: 20,
    flex: 1
  },
  itens_txtTitulo: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 5
  },
  itens_txtValor: {
    fontSize: 16,
		fontWeight: 'bold'
  }
});
