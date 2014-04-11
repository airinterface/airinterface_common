module('EBlockTest')

test('EBlock Test', () ->
  ret = es.block.getBlockID()
  same(ret,"0")
  same(jQuery("##{EBlock.blockIDPrefix}0").length,1)
)
