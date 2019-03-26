from merkletools import MerkleTools

mt = MerkleTools(hash_type="md5")

list_data = ['Hello', 'World', 'Is', 'First']

mt.add_leaf(list_data, True)

mt.make_tree()
print(mt.get_leaf(0))
print(mt.get_leaf(1))
print(mt.get_leaf(2))
print(mt.get_leaf(3))

print(mt.get_proof(0))

print(mt.get_merkle_root())