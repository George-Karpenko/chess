# Шахматы

Проект был создан для портфолио и для изучения некоторых тем в программировании.
Проект написан без зависимостей, можно запустить используя сервер.

## TODO

- В классе GridPieces нужно добавть переменную eatenOnAisle, так как она используется везде где используется gridPieces. Сам класс нужно переименовать.
- В классе User очень сложная логика для перемещения фигур, так же в ней есть баг из-за него можно ходить фигурами соперника на клетки, куда могут походить свои фигуры. Я не использовал dragdrop, так как с ним есть проблемы (фигуры полупрозрачние и фон от других объектов остаётся).
- Нужно заделить класс ViewCell, ещё и на ViewMove, чтобы в нём небыло логики хода