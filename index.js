function animate_liquid(deb,fin,target,duree=1000){
    const animate = new KeyframeEffect(target,
        [
            {
                height: `${deb}%`
            },
            {
                height: `${fin}%`
            }
        ],{duration : duree, fill: "forwards"})
    const animation = new Animation(animate)
    return animation 
}

function animate_transvaser(source,target,direction,bin,last_bin,max,min){
    let d = -1
    if(direction == "right"){
        d = 1
    }
    const hauteurG = max <= 3 ? max*100 : 300 
    const hauteurD = min <= 3 ? min*100 : 500 
    setTimeout(function(){
        setTimeout(function(){
            animate_liquid(last_bin[0]*100/max,bin[0]*100/max,source.querySelector(".content")).play()
            animate_liquid(last_bin[1]*100/min,bin[1]*100/min,target.querySelector(".content")).play()
        },100)
    },500)
    new Animation(new KeyframeEffect(source,
    [
            {
                transform: "rotate(0deg)"
            },
            {
                transform: `rotate(${d*80}deg) translateY(-300px) translateX(${-d*(direction=="right"?hauteurD : hauteurG)}px)`
            },
            {
                transform: "rotate(0deg) translate(0)"
            }
    ],{duration : 1500,fill : "forwards"})).play()
}

class Carafe{
    constructor(max,classe){
        this.max = max
        this.current = 0
        this.carafe = classe
    }
    transvaser(dest){
        const qte = dest.max - dest.current
        if(this.current >= qte) {
            dest.current = dest.max
            this.current = this.current - qte
        }else{
            dest.current += this.current
            this.current = 0
        }
        return [this.current, dest.current]
    }
    remplir(){
        this.current = this.max
    }
    vider(){
        this.current = 0
    }
}
const functions = [
    function transvaser(s,d){
        return s.transvaser(d)
    },
    function remplir(s,d){
        return [s.max, d.current]
    },
    function vider(s,d){
        return [0, d.current]
    }
]
const createPath = (dep,nodes,parent,manners) => {
    const r = []
    let current = nodes[dep]
    while(current != null){
        r.push([current,manners[dep]])
        current = nodes[parent[dep]]
        dep = parent[dep]
    }
    return r.reverse()
}
const search = (nodes,node) => {
    for(let i = 0; i < nodes.length; i++){
        const n = nodes[i]
        if(n[0] == node[0] && n[1] == node[1]) return i
    }
    return -1
}
const resoudre = (c1,c2,target) => {
    const OUVERT = [[0,0]], FERME = []
    const nodes = [[0,0]], parents = [null], manners=[null]
    const max = c1.max > c2.max ? c1 : c2
    const min = c1.max > c2.max ? c2 : c1
    while(OUVERT.length > 0){
        const node = OUVERT.pop()
        let current_i = search(nodes,node)
        if(node[0] == target)
        {
            return createPath(current_i,nodes,parents,manners)
        }else{
            for(let i = 0; i < 3; i++){
                max.current = node[0]
                min.current = node[1]
                const n = functions[i](max,min),n1 = functions[i](min,max).reverse()
                if(search(nodes,n) == -1){
                    nodes.push(n)
                    OUVERT.push(n)
                    parents.push(current_i)
                    manners.push(`${functions[i].toString().split(" ")[1].split("(")[0]},max`)
                }
                if(search(nodes,n1) == -1){
                    nodes.push(n1)
                    OUVERT.push(n1)
                    parents.push(current_i)
                    manners.push(`${functions[i].toString().split(" ")[1].split("(")[0]},min`)
                }
            }
            FERME.push(node)
        }
    }
    return 0
}

function inverser(a){
    let r = []
    for(let i = a.length - 1; i >= 0; i--){
        r.push(a[i])
    }
    return r
}
