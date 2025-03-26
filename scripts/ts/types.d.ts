export interface ModelType<T = number>{
    id: T;
    name: string,
}

export interface ModelType2<KeyType = string, ValueType = string>{
    key: KeyType;
    value: ValueType;
}