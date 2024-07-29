export default function lazy<T>(factory: () => T) {
    let cache: T;
    return () => (cache ??= factory());
}