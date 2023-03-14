import React from 'react'
import * as Styled from '../styled'

export const TrailMapRule = () => {
  return (
    <Styled.TrailMapRule>
      <h3>CNDT2022 Trail Map ルール</h3>
      <ul>
        <li>
          100ptにつき、抽選券1つゲット！たくさん貯めれば当選確率があがる！
        </li>
        <li>
          <span>セッションを視聴してスタンプを獲得すると、15pt！</span>
          <br />
          <span>
            （スタンプは、午前のキーノートで1つ、午後は1枠ごとに1つ獲得できます）
          </span>
        </li>
        <li>すべてのスタンプを集めると、コンプリートボーナスで60pt！</li>
        <li>セッションでコメントすると5pt！（各セッション1回限り）</li>
        <li>前日までの事前登録で30pt！現地会場チェックインで30pt！</li>
        <li>他にもポイントがもらえるチャンスがあるかも？</li>
        <li>
          当選した方には、後日登録メールアドレス宛にノベルティ送付先の入力フォームをお送りします。
        </li>
      </ul>
    </Styled.TrailMapRule>
  )
}
