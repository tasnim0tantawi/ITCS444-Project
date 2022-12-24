import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map} from "rxjs/operators";


export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  supplier: string;
  quantity: number;
  soldQuantity: number;
}
export interface Order {
  id?: string;
  customerName: string;
  product_ids: string[];
  totalPrice: number;
  totalQuantity: number;
  date: Date;
}
export interface shifts {
  id?:string;
  date:string;
  shift1id: string;
  shift1name: string;
  shift2id: string;
  shift2name: string;
}

export interface User {
  id?: string;
  name: string;
  username: string;
  role: string;
  password: string;
  email: string;
}
export interface Supplier {
  id?: string;
  name: string;
  product_ids: string[];
  phone: string;
  logo: string;
  soldQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ColdStoreDataService {
  private productsCollection: AngularFirestoreCollection<Product>;
  products: Observable<Product[]>;


  ordersCollection: AngularFirestoreCollection<Order>;
  orders: Observable<Order[]>;

  users: Observable<User[]>;
  usersCollection: AngularFirestoreCollection<User>;

  suppliers: Observable<Supplier[]>;
  providersCollection: AngularFirestoreCollection<Supplier>;

  public logged: boolean = false;

  public loggedEmail: string="";

  public loggedId: string="";

  public loggedRole:string="";

  allUsers:User[]=[];
  allOrders:Order[]=[];
  allSuppliers: Supplier[] = [];
  allEmployees: User[] = [];




  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.productsCollection = afs.collection<Product>('products');
    this.products = this.afs.collection<Product>('products').snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Product;
          const id = a.payload.doc.id;
          return {id, ...data};
        }
      )));

    this.ordersCollection = afs.collection<Order>('orders');
    this.orders = this.afs.collection<Order>('orders').snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Order;
          const id = a.payload.doc.id;
          return { id, ...data };
        }
      )));

    this.usersCollection = afs.collection<User>('users');
    this.users = this.afs.collection<User>('users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        }
      )));

    this.providersCollection = afs.collection<Supplier>('providers');
    this.suppliers = this.afs.collection<Supplier>('providers').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Supplier;
        const id = a.payload.doc.id;
        return {id, ...data};
      })));

    this.getallusers();
  }


  getallusers(){
    this.users.subscribe( (data)=>{this.allUsers=data});
  }


// add firebase CRUD methods here
  createProduct(product: Product) {
    // add product to firebase
    return this.productsCollection.add(product);
  }


  updateProduct(product: Product){
    // update product in firebase
    return this.productsCollection.doc(product.id).update({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      supplier: product.supplier,
      quantity: product.quantity,
      soldQuantity: product.soldQuantity
    })

  }

  deleteProduct(product: Product) {
    // delete product from firebase
    return this.productsCollection.doc(product.id).delete();
  }
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.products.pipe(
      map(products => products.filter(product => product.category === category))
    );
  }
  getProduct(id: string)  {
    return this.products.pipe(
      map(products => products.find(product => product.id === id))
    );
  }

  getProducts(): Observable<Product[]> {
    return this.products;
  }
  sellProduct(product: Product, quantity: number, supplier: Supplier) {
    // update product quantity in firebase
    return this.productsCollection.doc(product.id).update({
      quantity: product.quantity - quantity,
      soldQuantity: product.soldQuantity + quantity
         }).then(() => {
      // update supplier soldQuantity in firebase
      return this.providersCollection.doc(supplier.id).update({
        soldQuantity: supplier.soldQuantity + quantity
      });
    })
  }

  createOrder(order: Order) {
    // add order to firebase
    return this.ordersCollection.add(order);
  }
  updateOrder(order: Order){
    // update order in firebase
    return this.ordersCollection.doc(order.id).update({
      id: order.id,
      customerName: order.customerName,
      product_ids: order.product_ids,
      totalPrice: order.totalPrice,
      totalQuantity: order.totalQuantity,
      date: order.date
    })
  }

  getOrder(id: string): Observable<Order | undefined> {
    return this.ordersCollection.doc<Order>(id).valueChanges().pipe(
      map(order => {
        if (order) {
          order.id = id;
        }
        return order;
      })
    );

  }


  getOrders(): Observable<Order[]> {
    return this.orders;

  }
  deleteOrder(order: Order) {
    // delete order from firebase
    return this.ordersCollection.doc(order.id).delete();

  }
  createUser(user: User) {
    // add user to firebase
    return this.usersCollection.add(user);
  }
  updateUser(user: User){
    // update user in firebase
    return this.usersCollection.doc(user.id).update({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      password: user.password
    })
  }
  deleteUser(user: User) {
    // delete user from firebase
    return this.usersCollection.doc(user.id).delete();
  }

  getUser(id: string): Observable<User | undefined> {
    return this.usersCollection.doc<User>(id).valueChanges().pipe(
      map(user => {
        if (user) {
          user.id = id;
        }
        return user;
      })
    );
  }


  getUsers(): Observable<User[]> {
    return this.users;
  }
  getEmployees(): Observable<User[]> {
    return this.users.pipe(
      map(users => users.filter(user => user.role === 'employee'))
    );
  }


  createSupplier(supplier: Supplier) {
    // add provider to firebase
    return this.providersCollection.add(supplier);
  }
  updateSupplier(supplier: Supplier){
    // update provider in firebase
    return this.providersCollection.doc(supplier.id).update({
      id: supplier.id,
      name: supplier.name,
      product_ids: supplier.product_ids,
      phone: supplier.phone,
      logo: supplier.logo
    })


  }
  deleteSupplier(provider: Supplier) {
    // delete provider from firebase
    return this.providersCollection.doc(provider.id).delete();
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.suppliers;
  }

  getProvider(id: string): Observable<Supplier | undefined> {
    return this.providersCollection.doc<Supplier>(id).valueChanges().pipe(
      map(provider => {
          if (provider) {
            provider.id = id;
          }
          return provider;
        }
      ));
  }

  checkRole(){
    for(let i=0;i<this.allUsers.length;i++){
      if( this.allUsers[i].email==this.loggedEmail && this.allUsers[i].role=="owner") {
        this.loggedRole="owner";
      }
      if( this.allUsers[i].email==this.loggedEmail && this.allUsers[i].role=="employee") {
        this.loggedRole="employee";
      }
      if( this.allUsers[i].email==this.loggedEmail && this.allUsers[i].role=="supplier") {
        this.loggedRole="supplier";
      }
    }
    return this.loggedRole;
  }


}
