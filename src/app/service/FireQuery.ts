import { WhereFilterOp } from '@firebase/firestore'
import { toCamelCase } from '../common/utils'
import { Document } from '../model/_document'

export class FireQueryWhere {
    param: string
    comparator: WhereFilterOp
    value: any
  
    constructor (param: string, comparator: WhereFilterOp, value: any) {
      this.param = param
      this.comparator = comparator
      this.value = value
    }
}

export class FireQuery<T extends Document> {
    type: new() => T
    fromParam: string;
    whereParam: FireQueryWhere[] = []
  
    static select<T extends Document>(type: new() => T): FireQuery<T> {
      const query = new FireQuery<T>()
      query.type = type
      query.fromParam = toCamelCase(new type().constructor.name)
      return query
    }

    where(param: string, comparator: WhereFilterOp, value: any): FireQuery<T> {
        this.whereParam.push(new FireQueryWhere(param, comparator, value))
        return this
    }

    and(param: string, comparator: WhereFilterOp, value: any): FireQuery<T> {
        this.whereParam.push(new FireQueryWhere(param, comparator, value))
        return this
    }
}